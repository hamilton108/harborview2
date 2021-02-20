{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "pureuser"
, dependencies =
  [ "aff"
  , "affjax"
  , "argonaut"
  , "argonaut-codecs"
  , "arrays"
  , "canvas"
  , "console"
  , "effect"
  , "foreign"
  , "foreign-generic"
  , "functions"
  , "lists"
  , "nullable"
  , "numbers"
  , "ordered-collections"
  , "prelude"
  , "psci-support"
  , "random"
  , "refs"
  , "spec"
  , "test-unit"
  , "web-dom"
  , "web-events"
  , "web-html"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
