defmodule AiusWebsite.Repo.Migrations.CreateMemberships do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :first_name, :string, null: false
      add :middle_name, :string, null: true
      add :last_name, :string, null: false
      add :email, :string, null: false
      add :subscribed, :boolean, null: false

      timestamps()
    end

    create table(:periods) do
      add :start, :date, null: false
      add :end, :date, null: false

      timestamps()
    end

    create table(:memberships) do
      add :valid, :boolean, null: false
      add :user_id, references(:users)
      add :period_id, references(:periods)

      timestamps()
    end

    create constraint(:periods, :boundaries_in_order, check: ~s("start" < "end"))
  end
end
