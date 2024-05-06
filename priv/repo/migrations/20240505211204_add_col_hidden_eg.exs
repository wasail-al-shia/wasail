defmodule Wasail.Repo.Migrations.AddColHiddenEg do
  use Ecto.Migration

  def up do
    alter table("easy_guide") do
      add_if_not_exists :hide, :boolean, default: false
    end
  end

  def down do
    alter table("easy_guide") do
      remove :hide
    end
  end
end
