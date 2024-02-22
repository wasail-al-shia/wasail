defmodule Wasail.Util.Http do
  require Logger

  def get(url), do: http(:get, url)
  def post(payload, url), do: http(:post, url, payload)
  def post_txt(payload, url), do: http(:post_txt, url, payload)
  def post_encoded(payload, url), do: http(:post_encoded, url, payload)
  def post_xml(xml, url), do: http(:post_xml, url, xml)
  def put(payload, url), do: http(:put, url, payload)
  def delete(url), do: http(:delete, url)

  def post_auth(payload, url, token) do
    headers = [
      {"Content-Type", "application/json"},
      {"Accept", "application/json"},
      {"Authorization", "Bearer #{token}"}
    ]

    # Logger.info("post_auth : #{url} : #{inspect(payload)}")

    HTTPoison.post(url, Jason.encode!(payload), headers, options())
    |> extract_body(url)
    |> maybe_decode_json()
  end

  def http(command, url, payload \\ nil) do
    headers = get_headers(command)
    payload = get_payload(command, payload)
    poison_fn = get_poison_fn(command)

    final_fn = fn ->
      poison_fn.(url, payload, headers, options())
      |> extract_body(url)
      |> maybe_decode_json()
    end

    Logger.warning("#{command} : #{url} : #{inspect(payload)} : #{inspect(headers)}")
    final_fn.()
  end

  def get_headers(:post_xml), do: [{"content-type", "text/xml"}]
  def get_headers(:post_encoded), do: [{"content-type", "application/x-www-form-urlencoded"}]
  def get_headers(:delete), do: []

  def get_headers(command) when command in [:post, :put],
    do: [{"content-type", "application/json"}]

  def get_headers(command) when command in [:get, :post_txt], do: [{"content-type", "text/plain"}]

  def get_payload(command, payload) when command in [:post, :put], do: Jason.encode!(payload)
  def get_payload(:post_encoded, payload), do: URI.encode_query(payload)
  def get_payload(_, payload), do: payload

  def get_poison_fn(:get),
    do: fn url, nil, headers, opts -> HTTPoison.get(url, headers, opts) end

  def get_poison_fn(command) when command in [:post, :post_txt, :post_encoded, :post_xml],
    do: &HTTPoison.post/4

  def get_poison_fn(:put), do: &HTTPoison.put/4

  def get_poison_fn(:delete),
    do: fn url, nil, headers, opts -> HTTPoison.delete(url, headers, opts) end

  def post_mp(url, payload) do
    HTTPoison.post(url, payload, [{"content-type", "application/octet-stream"}], options())
    |> extract_body(url)
    |> maybe_decode_json()
  end

  def extract_body(response, url) do
    case response do
      {:ok, %{:status_code => 200, :body => body}} ->
        body

      {:ok, %{:status_code => 401, :body => body}} ->
        msg = "Unauthorized: HTTP 401 " <> "(url = #{url}): #{inspect(body)}"
        Logger.error(msg)
        body

      {:ok, %{:status_code => 503, :body => body}} ->
        msg = "Service Unavailable: HTTP 503 " <> "(url = #{url}): #{inspect(body)}"
        Logger.error(msg)
        body

      {:ok, %{:status_code => 500, :body => body}} ->
        msg =
          "Internal Server Error: HTTP 500 response " <>
            "(url = #{url}): #{inspect(body)}"

        Logger.error(msg)
        raise msg

      {:ok, %{:status_code => status_code, :body => body}} ->
        msg = "Error: HTTP #{status_code} response " <> "(url = #{url}): #{inspect(body)}"
        Logger.error(msg)
        raise msg

      {:error, %HTTPoison.Error{reason: reason}} ->
        msg = "Poison error in http call " <> "(url = #{url}): #{inspect(reason)}"
        Logger.error(msg)
        raise msg
    end
  end

  def maybe_decode_json(str) do
    case Jason.decode(str) do
      {:ok, result} -> result
      _ -> str
    end
  end

  def options() do
    timeout = 3600_000
    [connect_timeout: timeout, recv_timeout: timeout, timeout: timeout]
  end
end
