defmodule WasailWeb.Graphql.EasyGuideResolver do
  require Logger
  alias Wasail.{EasyGuideCategory, EasyGuide, EasyGuideFragment}

  def categories(_args, _info) do
    {:ok, EasyGuideCategory.all()}
  end

  def category(%{category_id: category_id} = _params, _info) do
    {:ok, EasyGuideCategory.get(category_id)}
  end

  def easy_guides(%{category_id: category_id} = _params, _info) do
    {:ok, EasyGuide.all(category_id)}
  end

  def all_easy_guides(_params, _info) do
    {:ok, EasyGuide.all()}
  end

  def easy_guide(%{id: id} = _params, _info) do
    {:ok, EasyGuide.get(id)}
  end

  def report_fragments(_params, _info) do
    {:ok, EasyGuideFragment.get_report_fragments()}
  end

  def add_category(%{name: _name, cat_seq_no: _cat_seq_no} = params, _info) do
    # Logger.info("add category params: #{inspect(params)}")

    case EasyGuideCategory.insert(params) do
      {:error, changeset} ->
        message = "Could not create category: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, easy_guide_category} ->
        {:ok, %{status: :ok, message: "Added category: #{easy_guide_category.name}"}}
    end
  end

  def update_category(%{id: id} = params, _info) do
    # Logger.info("update category params: #{inspect(params)}")

    case EasyGuideCategory.update(id, params) do
      {:error, changeset} ->
        message = "Could not update category: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, easy_guide_category} ->
        {:ok, %{status: :ok, message: "Updated category with key: #{easy_guide_category.id}"}}
    end
  end

  def add_easy_guide(
        %{easy_guide_category_id: _i, title: _t, abbreviated: _a, eg_seq_no: _e} = params,
        _info
      ) do
    case EasyGuide.insert(params) do
      {:error, changeset} ->
        message = "Could not create easy guide: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, easy_guide} ->
        {:ok, %{status: :ok, message: "Added easy guide: #{easy_guide.title}"}}
    end
  end

  def update_easy_guide(%{id: id} = params, _info) do
    case EasyGuide.update(id, params) do
      {:error, changeset} ->
        message = "Could not update easy guide: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, easy_guide} ->
        {:ok, %{status: :ok, message: "Updated easy guide with key: #{easy_guide.id}"}}
    end
  end

  def add_fragment(%{easy_guide_id: _i, frag_seq_no: _e} = params, _info) do
    case EasyGuideFragment.insert(params) do
      {:error, changeset} ->
        message = "Could not create easy guide fragment: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, fragment} ->
        {:ok, %{status: :ok, message: "Added easy guide fragment: #{fragment.id}"}}
    end
  end

  def update_fragment(%{id: id} = params, _info) do
    case EasyGuideFragment.update(id, params) do
      {:error, changeset} ->
        message = "Could not update easy guide fragment: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, fragment} ->
        {:ok, %{status: :ok, message: "Updated easy guide fragment with key: #{fragment.id}"}}
    end
  end

  def delete_category(%{id: id}, _info) do
    case EasyGuideCategory.delete(id) do
      {:ok, easy_guide_category} ->
        {:ok,
         %{status: :ok, message: "Deleted easy guide category with key #{easy_guide_category.id}"}}

      other ->
        message = "Could not delete category: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def delete_easy_guide(%{id: id}, _info) do
    case EasyGuide.delete(id) do
      {:ok, easy_guide} ->
        {:ok, %{status: :ok, message: "Deleted easy guide with id #{easy_guide.id}"}}

      other ->
        message = "Could not delete easy guide: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def delete_fragment(%{id: id}, _info) do
    case EasyGuideFragment.delete(id) do
      {:ok, easy_guide_fragment} ->
        {:ok,
         %{status: :ok, message: "Deleted easy guide fragment with id #{easy_guide_fragment.id}"}}

      other ->
        message = "Could not delete easy guide fragment: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end
