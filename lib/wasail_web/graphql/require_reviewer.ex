defmodule WasailWeb.Graphql.RequireReviewer do
  @behaviour Absinthe.Middleware
  require Logger

  def call(%Absinthe.Resolution{state: :resolved} = resolution, _config), do: resolution

  def call(%Absinthe.Resolution{context: %{user_info: %{is_admin: true}}} = resolution, _config),
    do: resolution

  def call(
        %Absinthe.Resolution{context: %{user_info: %{is_reviewer: true}}} = resolution,
        _config
      ),
      do: resolution

  def call(%Absinthe.Resolution{} = resolution, _config) do
    Absinthe.Resolution.put_result(
      resolution,
      {:error, "You are not authorized reviewer to perform this operation."}
    )
  end
end
