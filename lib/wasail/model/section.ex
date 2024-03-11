defmodule Wasail.Section do
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.{Book, Section, Chapter, Report}
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(Section, id) |> Repo.preload([:book])

  def all(book_id) do
    Section
    |> QueryUtil.put_filters(book_id: book_id)
    |> QueryUtil.put_sort(asc: :section_no)
    |> Repo.all()
    |> Repo.preload(:chapters)
  end

  def report_range_book(book_id) do
    query =
      from(r in Report,
        join: c in Chapter,
        on: r.chapter_id == c.id,
        join: s in Section,
        on: c.section_id == s.id,
        join: b in Book,
        on: s.book_id == b.id,
        where: b.id == ^book_id,
        group_by: [s.id, c.id],
        select: %{
          entity_id: s.id,
          start_report_no: min(r.report_no),
          end_report_no: max(r.report_no)
        }
      )

    Repo.all(query)
  end

  def report_range_section(section_id) do
    query =
      from(r in Report,
        join: c in Chapter,
        on: r.chapter_id == c.id,
        join: s in Section,
        on: c.section_id == s.id,
        where: s.id == ^section_id,
        group_by: [c.id],
        select: %{
          entity_id: c.id,
          start_report_no: min(r.report_no),
          end_report_no: max(r.report_no)
        }
      )

    Repo.all(query)
  end

  def insert(rec),
    do:
      %Section{}
      |> changeset(rec)
      |> Repo.insert()

  def update(section_id, changes = %{}) do
    section_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  @attr_list [:book_id, :section_no, :name_eng, :name_arb, :desc_eng, :desc_arb]
  def changeset(%Section{} = section, attrs \\ %{}) do
    section
    |> Ecto.Changeset.cast(attrs, @attr_list)
    |> Ecto.Changeset.validate_required([
      :book_id,
      :section_no
    ])
  end

  def delete(section_id) do
    get(section_id)
    |> case do
      %Section{} = s -> Repo.delete(s)
      nil -> nil
    end
  end
end
