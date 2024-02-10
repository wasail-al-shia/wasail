defmodule Wasail.Util.Sys do
  def is_admin(uid) do
    uid in Application.get_env(:wasail, :admin_uids)
  end

  def sleep(seconds) do
    :timer.sleep(seconds * 1000)
  end
end
