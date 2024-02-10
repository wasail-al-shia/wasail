defmodule WasailWeb.Graphql.TextResolver do
  require Logger
  alias Wasail.Text, as: Text

  def texts_by_report_id(%{report_id: report_id}, _info) do
    {:ok, Text.get_by_report_id(report_id)}
  end

  def add_text(
        %{
          report_id: _report_id,
          fragment_no: _fragment_no,
          text_eng: _text_eng,
          text_arb: _text_arb
        } = params,
        _info
      ) do
    case Text.insert(params) do
      {:error, changeset} ->
        message = "Could not add text: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, text} ->
        {:ok,
         %{
           status: :ok,
           message: "Added text #{text.id}, fragment no. #{text.fragment_no}"
         }}
    end
  end

  def update_text(
        %{text_id: text_id} = params,
        _info
      ) do
    Logger.info("update text params: #{inspect(params)}")

    case Text.update(text_id, params) do
      {:error, changeset} ->
        message = "Could not update text: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, text} ->
        {:ok, %{status: :ok, message: "Updated text with id: #{text.id}"}}
    end
  end

  def delete_text(%{text_id: text_id}, _info) do
    Logger.info("delete text: #{inspect(text_id)}")

    case Text.delete(text_id) do
      {:ok, text} ->
        {:ok, %{status: :ok, message: "Deleted text with key #{text.id}"}}

      other ->
        message = "Could not delete text: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end
