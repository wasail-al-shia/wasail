defmodule Wasail.Activity do
  require Logger
  import Ecto.Query
  alias Wasail.IpInfo
  alias Wasail.Repo
  alias Wasail.Schema.Activity, as: Activity
  alias Wasail.Schema.IpInfo, as: IpInfo

  def get(id), do: Repo.get(Activity, id)

  def get_most_recent(n) do
    query =
      from(a in Activity,
        join: i in IpInfo,
        on: a.ip_info_id == i.id,
        order_by: [desc: field(a, :inserted_at)],
        limit: ^n,
        select: %{
          id: a.id,
          activity_type: a.activity_type,
          user_agent: a.user_agent,
          ip: i.ip,
          country: i.country,
          region: i.region,
          city: i.city,
          chapter_id: a.chapter_id,
          report_id: a.report_id,
          search_str: a.search_str,
          desc: a.desc,
          inserted_at: a.inserted_at
        }
      )

    query |> Repo.all()
  end

  # select date(a.inserted_at), count(distinct i.ip)
  # from activity a, ip_info i
  # where a.ip_info_id  = i.id
  # group by date(a.inserted_at)
  # order by date(a.inserted_at) desc;

  def get_unique_visitors_by_day(n \\ 30) do
    query =
      from(a in Activity,
        join: i in IpInfo,
        on: a.ip_info_id == i.id,
        where: a.inserted_at > ago(^n, "day"),
        group_by: fragment("date(a0.inserted_at)"),
        order_by: [desc: fragment("date(a0.inserted_at)")],
        select: %{
          date: fragment("date(a0.inserted_at)"),
          num_visitors: fragment("count(distinct(i1.ip))")
        }
      )

    query |> Repo.all()
  end

  def count(n) do
    query =
      from(a in Activity,
        select: count(a.id),
        where: a.inserted_at > ago(^n, "day")
      )

    Repo.one(query)
  end

  def insert(rec),
    do:
      %Activity{}
      |> changeset(rec)
      |> Repo.insert()

  def changeset(%Activity{} = activity, attrs \\ %{}) do
    activity
    |> Ecto.Changeset.cast(attrs, [
      :ip_info_id,
      :activity_type,
      :user_agent,
      :report_id,
      :chapter_id,
      :search_str,
      :desc
    ])
    |> Ecto.Changeset.validate_required([
      :ip_info_id,
      :activity_type
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %Activity{} = a -> Repo.delete(a)
      nil -> nil
    end
  end

  def delete_old_records(n \\ 30) do
    Repo.transaction(fn ->
      delete_old_activity_records(n)
      delete_orphan_ip_info_records()
    end)
  end

  def delete_old_activity_records(n) do
    # find activity records older than n days
    {num_deleted, _} =
      from(a in Activity,
        where: a.inserted_at < ^DateTime.add(DateTime.utc_now(), n * -1, :day)
      )
      |> Repo.delete_all()

    Logger.info("Deleted #{num_deleted} activity records")
  end

  def delete_orphan_ip_info_records do
    # subquery to find all ip_info ids referenced in the activity table
    referenced_parent_ids_subquery =
      from(c in Activity,
        select: c.ip_info_id,
        distinct: true
      )

    # left join to find ip_info records not referenced by any activity
    orphan_parents_query =
      from(p in IpInfo,
        where: p.id not in subquery(referenced_parent_ids_subquery)
      )

    # delete these ip_info records
    {num_deleted, _} = Repo.delete_all(orphan_parents_query)
    Logger.info("Deleted #{num_deleted} ip_info records")
  end
end
