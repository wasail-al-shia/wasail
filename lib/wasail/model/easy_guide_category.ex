defmodule Wasail.EasyGuideCategory do
  require Logger
  import Ecto.Query
  alias Wasail.Schema.EasyGuideCategory
  alias Wasail.Repo

  def get(id),
    do: Repo.get(EasyGuideCategory, id)

  def all() do
    EasyGuideCategory
    |> order_by(asc: :cat_seq_no)
    |> Repo.all()

    # |> Repo.preload(:easy_guides)
  end

  def insert(rec) do
    %EasyGuideCategory{}
    |> changeset(rec)
    |> Repo.insert()
  end

  def changeset(%EasyGuideCategory{} = easy_guide_category, attrs \\ %{}) do
    easy_guide_category
    |> Ecto.Changeset.cast(attrs, [
      :name,
      :cat_seq_no,
      :description
    ])
    |> Ecto.Changeset.validate_required([
      :name,
      :cat_seq_no
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
      %EasyGuideCategory{} = c -> Repo.delete(c)
      nil -> nil
    end
  end
end
