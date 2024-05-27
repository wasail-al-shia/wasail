defmodule Wasail.Chapter do
  require Logger
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.Chapter, as: Chapter
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(Chapter, id) |> Repo.preload(section: [:book])

  def get_by_section_id(section_id) do
    Chapter
    |> QueryUtil.put_filters(section_id: section_id)
    |> QueryUtil.put_sort(asc: :chapter_no)
    |> Repo.all()
    |> Repo.preload(section: [:book])
    |> Repo.preload(reports: [:texts, :comments])
  end

  def insert(rec),
    do:
      %Chapter{}
      |> changeset(rec)
      |> Repo.insert()

  def update(chapter_id, changes = %{}) do
    chapter_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  def changeset(%Chapter{} = chapter, attrs \\ %{}) do
    chapter
    |> Ecto.Changeset.cast(attrs, [
      :section_id,
      :chapter_no,
      :name_eng,
      :name_arb,
      :desc_eng,
      :desc_arb
    ])
    |> Ecto.Changeset.validate_required([
      :section_id,
      :chapter_no,
      :name_eng
    ])
  end

  def delete(chapter_id) do
    get(chapter_id)
    |> case do
      %Chapter{} = c -> Repo.delete(c)
      nil -> nil
    end
  end

  def get_ids() do
    query =
      from(
        c in Chapter,
        order_by: {:asc, c.id},
        select: c.id
      )

    Repo.all(query)
  end
end
