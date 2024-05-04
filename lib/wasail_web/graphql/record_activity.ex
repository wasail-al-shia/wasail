defmodule WasailWeb.Graphql.RecordActivity do
  @behaviour Absinthe.Middleware
  require Logger

  def call(
        %Absinthe.Resolution{context: %{user_info: %{is_admin: true}}} = resolution,
        _config
      ) do
    resolution
  end

  def call(
        %Absinthe.Resolution{context: %{user_info: %{is_reviewer: true}}} = resolution,
        _config
      ) do
    resolution
  end

  def call(%Absinthe.Resolution{} = resolution, _config) do
    # IO.inspect(Map.keys(resolution.definition))
    IO.inspect(resolution.definition.name)
    # IO.inspect(resolution.arguments)

    record_activity(resolution)

    resolution
  end

  def record_activity(resolution) do
    user_agent = resolution.context.user_agent
    ip = resolution.context.client_ip
    # Logger.info("In record activity for #{inspect(resolution.definition)}")

    case String.match?(user_agent, ~r/bot|crawl|spider/i) do
      false ->
        Task.async(fn ->
          try do
            case resolution.definition.name do
              "report" ->
                report_id = resolution.arguments.report_id
                Wasail.ActivitySvc.record_report_activity(ip, user_agent, report_id)

              "chapter" ->
                chapter_id = resolution.arguments.chapter_id
                Wasail.ActivitySvc.record_chapter_activity(ip, user_agent, chapter_id)

              "easyGuide" ->
                guide_id = resolution.arguments.id
                Wasail.ActivitySvc.record_easy_guide_activity(ip, user_agent, guide_id)

              "search" ->
                search_str = resolution.arguments.query_str
                Wasail.ActivitySvc.record_search_activity(ip, user_agent, search_str)

              "processReportFeedback" ->
                report_id = resolution.arguments.report_id
                name = resolution.arguments.name
                Wasail.ActivitySvc.record_feedback_activity(ip, user_agent, report_id, name)

              "processContactForm" ->
                name = resolution.arguments.name
                Wasail.ActivitySvc.record_contact(ip, user_agent, name)
            end
          rescue
            err -> Logger.error("Error recording activity: #{inspect(err)}")
          end
        end)

      true ->
        Logger.info("not recording bot activity")
    end
  end
end
