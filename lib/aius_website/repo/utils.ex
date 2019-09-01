defmodule AiusWebsite.Repo.Utils do
  defmacro authors(opts \\ []) do
    quote bind_quoted: binding() do
      authors =
        [inserted_by: :inserted_by, updated_by: :updated_by, type: :string]
        |> Keyword.merge(opts)

      type = Keyword.fetch!(authors, :type)
      inserted_by = Keyword.fetch!(authors, :inserted_by)
      updated_by = Keyword.fetch!(authors, :updated_by)

      if inserted_by do
        Ecto.Schema.field(inserted_by, type, [])
      end

      if updated_by do
        Ecto.Schema.field(updated_by, type, [])
      end
    end
  end

  def set_author(changeset, author) do
    # TODO: field name change
    if Ecto.Changeset.get_field(changeset, :inserted_by) == nil do
      Ecto.Changeset.put_change(changeset, :inserted_by, author)
    else
      changeset
    end
    |> Ecto.Changeset.put_change(:updated_by, author)
  end
end
