defmodule WasailWeb.Graphql.RecordActivity do
  @behaviour Absinthe.Middleware
  require Logger

  def call(%Absinthe.Resolution{context: %{user_info: %{is_admin: true}}} = resolution, _config),
    do: resolution

  def call(%Absinthe.Resolution{} = resolution, _config) do
    # IO.inspect(Map.keys(resolution.definition))
    # IO.inspect(resolution.definition.name)
    # IO.inspect(resolution.arguments)

    user_agent = resolution.context.user_agent

    case String.match?(user_agent, ~r/bot|crawl|spider/i) do
      false ->
        ip = resolution.context.client_ip

        Task.async(fn ->
          try do
            case resolution.definition.name do
              "report" ->
                report_id = resolution.arguments.report_id
                Wasail.ActivitySvc.record_report_activity(ip, user_agent, report_id)

              "chapter" ->
                chapter_id = resolution.arguments.chapter_id
                Wasail.ActivitySvc.record_chapter_activity(ip, user_agent, chapter_id)

              "search" ->
                search_str = resolution.arguments.query_str
                Wasail.ActivitySvc.record_search_activity(ip, user_agent, search_str)

              _ ->
                Logger.error("Can't record unknown activity")
                nil
            end
          rescue
            err -> Logger.error("Error recording activity: #{inspect(err)}")
          end
        end)

      true ->
        Logger.info("not recording bot activity")
    end

    resolution
  end
end
