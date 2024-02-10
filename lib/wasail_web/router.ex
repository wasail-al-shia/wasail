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

  scope "/query" do
    pipe_through(:graphql)

    forward("/", Absinthe.Plug, schema: WasailWeb.Graphql.Schema)
  end

  scope "/auth", WasailWeb do
    pipe_through :browser

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
    delete "/logout", AuthController, :delete
  end

  scope "/graphiql" do
    forward("/", Absinthe.Plug.GraphiQL,
      schema: WasailWeb.Graphql.Schema,
      interface: :simple
    )
  end

  scope "/", WasailWeb do
    pipe_through :browser
    get "/ping", PageController, :ping

    get "/*path", PageController, :index
  end
end
