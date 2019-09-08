defmodule AiusWebsite.Repo.Migrations.AddMembershipSituation do
  use Ecto.Migration

  def change do
    alter table(:memberships) do
      add :situation, :string
    end
  end
end
