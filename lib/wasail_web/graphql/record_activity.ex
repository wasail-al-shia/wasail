defmodule WasailWeb.Graphql.RecordActivity do
  @behaviour Absinthe.Middleware
  require Logger

  def call(%Absinthe.Resolution{} = resolution, _config) do
    # IO.inspect(Map.keys(resolution.definition))
    # IO.inspect(resolution.definition.name)
    # IO.inspect(resolution.arguments)

    Task.async(fn ->
      try do
        case resolution.definition.name do
          "report" ->
            report_id = resolution.arguments.report_id
            ip = resolution.context.client_ip
            Wasail.ActivitySvc.record_report_activity(ip, report_id)

          "chapter" ->
            chapter_id = resolution.arguments.chapter_id
            ip = resolution.context.client_ip
            Wasail.ActivitySvc.record_chapter_activity(ip, chapter_id)

          "search" ->
            search_str = resolution.arguments.query_str
            ip = resolution.context.client_ip
            Wasail.ActivitySvc.record_search_activity(ip, search_str)

          _ ->
            Logger.error("Can't record unknown activity")
            nil
        end
      rescue
        err -> Logger.error("Error recording activity: #{inspect(err)}")
      end
    end)

    resolution
  end
end
