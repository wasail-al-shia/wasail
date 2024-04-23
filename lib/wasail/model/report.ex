defmodule Wasail.Report do
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.{Report, Chapter, Section, Book}

  def get(id),
    do:
      Repo.get(Report, id)
      |> Repo.preload(chapter: [section: [:book]])
      |> Repo.preload([:texts, :comments])

  def get_ws_report_id(report_no) do
    bk_cd = Application.get_env(:wasail, :bk_cd_ws)

    query =
      from(r in Report,
        join: c in Chapter,
        on: r.chapter_id == c.id,
        join: s in Section,
        on: c.section_id == s.id,
        join: b in Book,
        on: s.book_id == b.id,
        where:
          r.report_no == ^report_no and
            b.code == ^bk_cd
      )

    case Repo.one(query) do
      nil -> nil
      r -> r.id
    end
  end

  def get_most_recent() do
    from(r in Report,
      order_by: [desc: r.report_no],
      limit: 1
    )
    |> Repo.one()
    |> Repo.preload(:chapter)
  end

  def get_by_chapter_id(chapter_id) do
    Report
    |> where([report], report.chapter_id == ^chapter_id)
    |> order_by(asc: :report_no)
    |> Repo.all()
    |> Repo.preload([:texts, :comments])
  end

  def insert(rec),
    do:
      %Report{}
      |> changeset(rec)
      |> Repo.insert()

  def update(report_id, changes = %{}) do
    report_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  def update_review_flag(report_id, review) do
    changeset =
      report_id
      |> get()
      |> Ecto.Changeset.change(review: review)

    case Repo.update(changeset) do
      {:ok, updated_record} ->
        {:ok, updated_record}

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  def changeset(%Report{} = report, attrs \\ %{}) do
    report
    |> Ecto.Changeset.cast(attrs, [
      :chapter_id,
      :report_no,
      :heading_eng,
      :hide,
      :review,
      :notes
    ])
    |> Ecto.Changeset.validate_required([
      :chapter_id,
      :report_no,
      :heading_eng
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %Report{} = b -> Repo.delete(b)
      nil -> nil
    end
  end

  def get_all_report_no_by_book_id(book_id) do
    report_query =
      from(b in Book,
        join: s in Section,
        on: s.book_id == b.id,
        join: c in Chapter,
        on: c.section_id == s.id,
        join: r in Report,
        on: r.chapter_id == c.id,
        where: b.id == ^book_id,
        select: r.report_no
      )

    Repo.all(report_query)
  end

  def find_missing(book_id) do
    xs1 = Wasail.Util.Sys.report_range(book_id) |> MapSet.new()
    xs2 = get_all_report_no_by_book_id(book_id) |> MapSet.new()
    MapSet.difference(xs1, xs2)
  end
end
