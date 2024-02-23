defmodule Wasail.Util.Retry do
  require Logger
  use Retry

  def retry_function(function_to_execute) do
    default_delay_stream = Retry.DelayStreams.constant_backoff(10000) |> Stream.take(10)
    retry_function(function_to_execute, default_delay_stream)
  end

  def retry_function(
        function_to_execute,
        delay_stream,
        rescue_list \\ [TimeoutError, RuntimeError, HTTPoison.Error, Poison.SyntaxError]
      ) do
    result =
      Retry.retry with: delay_stream,
                  rescue_only: rescue_list do
        function_to_execute.()
      after
        result -> result
      else
        error ->
          Logger.info("Giving Up After Retries... Error = #{inspect(error)}")
          raise error
      end

    result
  end

  def default_rescue_list() do
    [Plug.TimeoutError, HTTPoison.Error, RuntimeError, Poison.SyntaxError]
  end
end
