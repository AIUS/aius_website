defmodule AiusWebsite.TermTest do
  use AiusWebsite.DataCase

  alias AiusWebsite.Term

  describe "periods" do
    alias AiusWebsite.Term.Period

    @valid_attrs %{end: ~D[2010-04-18], start: ~D[2010-04-17]}
    @update_attrs %{end: ~D[2011-05-19], start: ~D[2011-05-18]}
    @invalid_attrs %{end: nil, start: nil}

    def period_fixture(attrs \\ %{}) do
      {:ok, period} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Term.create_period()

      period
    end

    test "list_periods/0 returns all periods" do
      period = period_fixture()
      assert Term.list_periods() == [period]
    end

    test "get_period!/1 returns the period with given id" do
      period = period_fixture()
      assert Term.get_period!(period.id) == period
    end

    test "create_period/1 with valid data creates a period" do
      assert {:ok, %Period{} = period} = Term.create_period(@valid_attrs)
      assert period.end == ~D[2010-04-18]
      assert period.start == ~D[2010-04-17]
    end

    test "create_period/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Term.create_period(@invalid_attrs)
    end

    test "update_period/2 with valid data updates the period" do
      period = period_fixture()
      assert {:ok, %Period{} = period} = Term.update_period(period, @update_attrs)
      assert period.end == ~D[2011-05-19]
      assert period.start == ~D[2011-05-18]
    end

    test "update_period/2 with invalid data returns error changeset" do
      period = period_fixture()
      assert {:error, %Ecto.Changeset{}} = Term.update_period(period, @invalid_attrs)
      assert period == Term.get_period!(period.id)
    end

    test "delete_period/1 deletes the period" do
      period = period_fixture()
      assert {:ok, %Period{}} = Term.delete_period(period)
      assert_raise Ecto.NoResultsError, fn -> Term.get_period!(period.id) end
    end

    test "change_period/1 returns a period changeset" do
      period = period_fixture()
      assert %Ecto.Changeset{} = Term.change_period(period)
    end
  end
end
