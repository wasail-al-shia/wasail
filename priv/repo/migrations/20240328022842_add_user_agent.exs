defmodule Wasail.Repo.Migrations.AddUserAgent do
  use Ecto.Migration

  def up do
    alter table("activity") do
      add_if_not_exists :user_agent, :string
    end
  end

  def down do
    alter table("activity") do
      remove :user_agent
    end
  end
end
