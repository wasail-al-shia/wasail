defmodule Wasail.Section do
  alias Wasail.Repo
  alias Wasail.Schema.Section, as: Section
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(Section, id) |> Repo.preload([:book])

  def all(book_id) do
    Section
    |> QueryUtil.put_filters(book_id: book_id)
    |> QueryUtil.put_sort(asc: :section_no)
    |> Repo.all()
    |> Repo.preload(:chapters)
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
