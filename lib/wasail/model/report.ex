defmodule Wasail.Report do
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.Report, as: Report

  def get(id),
    do:
      Repo.get(Report, id)
      |> Repo.preload(chapter: [section: [:book]])
      |> Repo.preload([:texts, :comments])

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
