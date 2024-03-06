defmodule Wasail.Feedback do
  alias Wasail.Repo
  alias Wasail.Schema.Feedback, as: Feedback
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(Feedback, id)

  def get_by_report_id(report_id) do
    Feedback
    |> QueryUtil.put_filters(report_id: report_id)
    |> QueryUtil.put_sort(desc: :inserted_at)
    |> Repo.all()
  end

  def insert(rec),
    do:
      %Feedback{}
      |> changeset(rec)
      |> Repo.insert()

  def update(feedback_id, changes = %{}) do
    feedback_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  def changeset(%Feedback{} = feedback, attrs \\ %{}) do
    feedback
    |> Ecto.Changeset.cast(attrs, [
      :report_id,
      :sender_name,
      :sender_email,
      :comment,
      :reviewed,
      :resolution
    ])
    |> Ecto.Changeset.validate_required([
      :report_id,
      :sender_name,
      :sender_email,
      :comment
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %Feedback{} = f -> Repo.delete(f)
      nil -> nil
    end
  end
end
