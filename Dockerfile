# FROM elixir:alpine AS builder
#
# RUN \
#   apk add --no-cache \
#     npm \
#     nodejs \
#     git \
#     build-base && \
#   mix local.rebar --force && \
#   mix local.hex --force
#
# WORKDIR /build
# COPY . .
#
# ENV MIX_ENV=prod
# RUN mix do deps.get, deps.compile, compile
#
# RUN npm ci --prefix ./assets
# RUN npm run deploy --prefix ./assets
# RUN mix phx.digest
#
# RUN mix release
#
# FROM alpine
#
# COPY --from=builder /build/_build/prod/rel/aius_website /app
#
# ENTRYPOINT /app/bin/aius_website
# CMD start

FROM elixir:1.9.0-alpine as build

# install build dependencies
RUN apk add --update git build-base nodejs npm python

# prepare build dir
RUN mkdir /app
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# set build ENV
ENV MIX_ENV=prod

# install mix dependencies
COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get
RUN mix deps.compile

# build assets
COPY assets assets
RUN cd assets && npm ci && npm run deploy
RUN mix phx.digest

# build project
COPY priv priv
COPY lib lib
RUN mix compile

# build release
RUN mix release
RUN chown -R nobody: _build/prod/rel/aius_website

# prepare release image
FROM alpine:3.9 AS app
RUN apk add --update bash openssl

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/_build/prod/rel/aius_website ./
RUN chown nobody: .
USER nobody

ENV HOME=/app
