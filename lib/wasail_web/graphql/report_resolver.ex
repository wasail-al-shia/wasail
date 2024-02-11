defmodule WasailWeb.Graphql.ReportResolver do
  require Logger
  alias Wasail.Report, as: Report

  def report_by_id(%{report_id: report_id}, _info) do
    {:ok, Report.get(report_id)}
  end

  def reports_by_chapter_id(%{chapter_id: chapter_id}, _info) do
    {:ok, Report.get_by_chapter_id(chapter_id)}
  end

  def add_report(
        %{chapter_id: _chapter_id, report_no: _report_no, heading_eng: _heading_eng} = params,
        _info
      ) do
    case Report.insert(params) do
      {:error, changeset} ->
        message = "Could not add report: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, report} ->
        {:ok,
         %{
           status: :ok,
           message: "Added report #{report.id}, no. #{report.report_no}"
         }}
    end
  end

  def update_report(
        %{report_id: report_id} = params,
        _info
      ) do
    Logger.info("update report params: #{inspect(params)}")

    case Report.update(report_id, params) do
      {:error, changeset} ->
        message = "Could not update report: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, report} ->
        {:ok, %{status: :ok, message: "Updated report with id: #{report.id}"}}
    end
  end

  def delete_report(%{report_id: report_id}, _info) do
    Logger.info("delete report: #{inspect(report_id)}")

    case Report.delete(report_id) do
      {:ok, report} ->
        {:ok, %{status: :ok, message: "Deleted report with key #{report.id}"}}

      other ->
        message = "Could not delete report: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end
