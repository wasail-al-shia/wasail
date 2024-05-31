defmodule Wasail.Repo.Migrations.AddColEgFrag do
  use Ecto.Migration

  def up do
    alter table("easy_guide_fragment") do
      add_if_not_exists :heading, :string
      add_if_not_exists :list, :text
      add_if_not_exists :numbered_list, :boolean
    end

    alter table("activity") do
      add :entity_id, :integer
    end
  end

  def down do
    alter table("easy_guide_fragment") do
      remove :heading
      remove :list
      remove :numbered_list
    end

    alter table("activity") do
      remove :entity_id
    end
  end
end
