defmodule Wasail.EasyGuide do
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.EasyGuide
  alias Wasail.Util.Query, as: QueryUtil

  def get(id),
    do:
      Repo.get(EasyGuide, id)
      |> Repo.preload([
        :easy_guide_category,
        easy_guide_fragments: [report: [:texts, :comments, chapter: [section: [:book]]]]
      ])

  def all(category_id) do
    EasyGuide
    |> QueryUtil.put_filters(easy_guide_category_id: category_id)
    |> QueryUtil.put_sort(asc: :eg_seq_no)
    |> Repo.all()
    |> Repo.preload(:easy_guide_fragments)
  end

  def all() do
    EasyGuide
    |> order_by(asc: :abbreviated)
    |> Repo.all()
    |> Repo.preload(:easy_guide_fragments)
  end

  def insert(rec) do
    %EasyGuide{}
    |> changeset(rec)
    |> Repo.insert()
  end

  def changeset(%EasyGuide{} = eash_guide, attrs \\ %{}) do
    eash_guide
    |> Ecto.Changeset.cast(attrs, [
      :easy_guide_category_id,
      :title,
      :abbreviated,
      :eg_seq_no
    ])
    |> Ecto.Changeset.validate_required([
      :easy_guide_category_id,
      :title,
      :abbreviated,
      :eg_seq_no
    ])
  end

  def update(id, changes = %{}) do
    id
    |> get()
    |> Ecto.Changeset.change(changes)
    |> Repo.update()
  end

  def delete(id) do
    get(id)
    |> case do
      %EasyGuide{} = e -> Repo.delete(e)
      nil -> nil
    end
  end
end
