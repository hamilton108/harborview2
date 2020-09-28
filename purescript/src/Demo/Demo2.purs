module Demo.Demo2 where

import Prelude 

import Control.Monad.State

type MyState = State Int String


incs :: MyState 
incs = 
  get >>= \x ->
  put (x + 1) *>
  pure ("Hello! " <> show x)

x = runState incs 2 


