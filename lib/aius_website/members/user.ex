defmodule AiusWebsite.Members.User do
  use Ecto.Schema
  import Ecto.Changeset
  import AiusWebsite.Repo.Utils

  alias AiusWebsite.Members.Membership

  schema "users" do
    field :first_name, :string
    field :middle_name, :string, default: ""
    field :last_name, :string
    field :email, :string
    field :subscribed, :boolean, default: false
    field :birthdate, :date

    has_many :memberships, Membership

    timestamps()
    authors()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:first_name, :middle_name, :last_name, :email, :subscribed, :birthdate])
    |> cast_assoc(:memberships, with: &Membership.changeset/2)
    |> set_author(Map.get(attrs, :author))
    |> validate_required([:first_name, :last_name, :email, :birthdate])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
