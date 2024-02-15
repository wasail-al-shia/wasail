defmodule Wasail.Comment do
  alias Wasail.Repo
  alias Wasail.Schema.Comment, as: Comment
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(Comment, id)

  def get_by_report_id(report_id) do
    Comment
    |> QueryUtil.put_filters(report_id: report_id)
    |> QueryUtil.put_sort(asc: :comment_seq_no)
    |> Repo.all()
  end

  def insert(rec),
    do:
      %Comment{}
      |> changeset(rec)
      |> Repo.insert()

  def update(comment_id, changes = %{}) do
    comment_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  def changeset(%Comment{} = comment, attrs \\ %{}) do
    comment
    |> Ecto.Changeset.cast(attrs, [
      :report_id,
      :comment_seq_no,
      :comment_eng,
      :comment_arb
    ])
    |> Ecto.Changeset.validate_required([
      :report_id,
      :comment_seq_no,
      :comment_eng
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %Comment{} = c -> Repo.delete(c)
      nil -> nil
    end
  end
end
