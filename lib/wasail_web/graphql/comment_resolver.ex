defmodule WasailWeb.Graphql.CommentResolver do
  require Logger
  alias Wasail.Comment, as: Comment

  def comments_by_report_id(%{report_id: report_id}, _info) do
    {:ok, Comment.get_by_report_id(report_id)}
  end

  def add_comment(
        %{
          report_id: _report_id,
          comment_seq_no: _comment_seq_no,
          comment_eng: _comment_eng
        } = params,
        _info
      ) do
    case Comment.insert(params) do
      {:error, changeset} ->
        message = "Could not add comment: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, comment} ->
        {:ok,
         %{
           status: :ok,
           message: "Added comment #{comment.id}, seq no. #{comment.comment_seq_no}"
         }}
    end
  end

  def update_comment(
        %{comment_id: comment_id} = params,
        _info
      ) do
    Logger.info("update comment params: #{inspect(params)}")

    case Comment.update(comment_id, params) do
      {:error, changeset} ->
        message = "Could not update comment: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, comment} ->
        {:ok, %{status: :ok, message: "Updated comment with id: #{comment.id}"}}
    end
  end

  def delete_comment(%{comment_id: comment_id}, _info) do
    Logger.info("delete comment: #{inspect(comment_id)}")

    case Comment.delete(comment_id) do
      {:ok, comment} ->
        {:ok, %{status: :ok, message: "Deleted comment with key #{comment.id}"}}

      other ->
        message = "Could not delete comment: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end
