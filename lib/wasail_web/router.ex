defmodule WasailWeb.Router do
  use WasailWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    # plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :graphql do
    plug :fetch_session
    plug :accepts, ["json"]
    plug(WasailWeb.Graphql.ContextPlug)
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  scope "/query" do
    pipe_through(:graphql)

    forward("/", Absinthe.Plug, schema: WasailWeb.Graphql.Schema)
  end

  scope "/rest", WasailWeb do
    pipe_through(:api)

    post "/download_book", PageController, :download_book
    post "/record_page_view", PageController, :record_page_view
    get "/book_stats/:book_id", PageController, :book_stats
  end

  scope "/auth", WasailWeb do
    pipe_through :browser

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
    delete "/logout", AuthController, :delete
  end

  scope "/was_igql" do
    # TODO: restrict to admins
    forward("/", Absinthe.Plug.GraphiQL,
      schema: WasailWeb.Graphql.Schema,
      interface: :simple
    )
  end

  if Mix.env() == :dev do
    scope "/mailbox" do
      pipe_through :browser

      forward "/", Plug.Swoosh.MailboxPreview
    end
  end

  scope "/", WasailWeb do
    pipe_through :browser
    get "/ping", PageController, :ping
    get "/sitemap", PageController, :sitemap
    get "/file/:bucket/:filename", PageController, :get_file

    get "/*path", PageController, :index
  end
end
