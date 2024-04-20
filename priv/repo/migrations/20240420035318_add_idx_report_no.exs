defmodule Wasail.Repo.Migrations.AddIdxReportNo do
  use Ecto.Migration

  def up do
    create index("report", [:report_no])
  end

  def down do
    drop index("report", [:report_no])
  end
end
