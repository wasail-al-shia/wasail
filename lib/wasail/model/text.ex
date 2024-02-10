defmodule Wasail.Text do
  alias Wasail.Repo
  alias Wasail.Schema.Text, as: Text
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(Text, id)

  def get_by_report_id(report_id) do
    Text
    |> QueryUtil.put_filters(report_id: report_id)
    |> QueryUtil.put_sort(asc: :fragment_no)
    |> Repo.all()
    |> Repo.preload(comments: :comment)
  end

  def insert(rec),
    do:
      %Text{}
      |> changeset(rec)
      |> Repo.insert()

  def update(text_id, changes = %{}) do
    text_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  def changeset(%Text{} = text, attrs \\ %{}) do
    text
    |> Ecto.Changeset.cast(attrs, [
      :report_id,
      :fragment_no,
      :text_eng,
      :text_arb
    ])
    |> Ecto.Changeset.validate_required([
      :report_id,
      :fragment_no,
      :text_eng,
      :text_arb
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %Text{} = b -> Repo.delete(b)
      nil -> nil
    end
  end
end
