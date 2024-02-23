defmodule Wasail.Downloader do
  require Logger
  use Retry
  # 1 - 637
  @f_lib "https://lfile.ir/feqhi-library/book<NUM>.pdf"
  # 1 - 155
  @h_lib "https://lfile.ir/hadith-library/<NUM>.pdf"
  @download_dir "/Users/sbhinderwala/arabic_books/"

  def skip?(n, type) do
    case type do
      "f" -> File.exists?(@download_dir <> "f_book#{n}")
      "h" -> File.exists?(@download_dir <> "h_book#{n}")
      _ -> raise "unknown type #{type}"
    end
  end

  def file_name(n, type) do
    "#{type}_book#{n}.pdf"
  end

  def start(type) do
    end_book_no =
      case type do
        "f" -> 637
        "h" -> 155
        _ -> raise "unknown type"
      end

    for n <- 1..end_book_no do
      file_nm = file_name(n, type)

      case File.exists?(@download_dir <> file_nm) do
        true ->
          # Logger.info("skipping #{file_nm}")
          nil

        false ->
          Wasail.Util.Retry.retry_function(fn -> download(n, type) end)
      end
    end
  end

  def download_url(n, type) do
    case type do
      "f" -> String.replace(@f_lib, "<NUM>", "#{n}")
      "h" -> String.replace(@h_lib, "<NUM>", "#{n}")
      _ -> raise "unkown type"
    end
  end

  def download(n, type) do
    file_nm = file_name(n, type)
    url = download_url(n, type)

    Logger.info("Downloading: #{inspect(url)}")

    # pretend to be a browser
    headers = [
      {"User-Agent",
       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"}
    ]

    %HTTPoison.Response{body: body} = HTTPoison.get!(url, headers)
    File.write!(@download_dir <> file_nm, body)
  end
end
