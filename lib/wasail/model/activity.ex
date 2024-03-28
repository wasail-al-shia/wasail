defmodule Wasail.Activity do
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
          inserted_at: a.inserted_at
        }
      )

    query |> Repo.all()
  end

  def total() do
    query =
      from(a in Activity,
        select: count(a.id)
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
end
