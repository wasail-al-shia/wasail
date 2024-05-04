defmodule Wasail.Repo.Migrations.AddEasyGuideToActivity do
  use Ecto.Migration

  def up do
    alter table("activity") do
      add_if_not_exists :easy_guide_id, :integer
    end
  end

  def down do
    alter table("activity") do
      remove :easy_guide_id
    end
  end
end
