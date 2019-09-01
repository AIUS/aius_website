defmodule AiusWebsite.Repo.Migrations.AddAuthors do
  use Ecto.Migration

  # TODO: author macro
  def change do
    alter table(:users) do
      add :inserted_by, :string
      add :updated_by, :string
    end

    alter table(:periods) do
      add :inserted_by, :string
      add :updated_by, :string
    end

    alter table(:memberships) do
      add :inserted_by, :string
      add :updated_by, :string
    end
  end
end
