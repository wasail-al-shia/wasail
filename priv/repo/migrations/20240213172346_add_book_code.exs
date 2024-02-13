defmodule Wasail.Repo.Migrations.AddBookCode do
  use Ecto.Migration

  def up do
    alter table("book") do
      add_if_not_exists :code, :string
    end
  end

  def down do
    alter table("book") do
      remove :code
    end
  end
end
