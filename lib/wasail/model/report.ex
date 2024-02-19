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
    Report
    |> order_by(desc: :inserted_at)
    |> limit(1)
    |> Repo.one()
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
end
