module Maunaloa.Options.Tables exposing (config)

--import Common.Miscellaneous as M
--import Common.ComboBox as CMB

import Html as H
import Html.Attributes as A
import Html.Events as E
import Maunaloa.Options.Types
    exposing
        ( Msg(..)
        , Option
        , OptionMsg(..)
        , PurchaseMsg(..)
        )
import Table exposing (defaultCustomizations)


config : Table.Config Option Msg
config =
    Table.customConfig
        { toId = .ticker
        , toMsg = SetTableState
        , columns =
            [ checkboxColumn
            , buttonColumn
            , Table.stringColumn "Ticker" .ticker
            , Table.floatColumn "Exercise" .x
            , Table.floatColumn "Days" .days
            , Table.floatColumn "Buy" .buy
            , Table.floatColumn "Sell" .sell
            , Table.floatColumn "Spread" .spread
            , Table.floatColumn "IvBuy" .ivBuy
            , Table.floatColumn "IvSell" .ivSell
            , Table.floatColumn "Break-Even" .breakEven
            , Table.floatColumn "Risc" .risc
            , Table.floatColumn "O.P. at Risc" .optionPriceAtRisc
            , Table.floatColumn "S.P. at Risc" .stockPriceAtRisc
            ]
        , customizations =
            { defaultCustomizations | tableAttrs = toTableAttrs, rowAttrs = toRowAttrs }
        }


toTableAttrs : List (H.Attribute Msg)
toTableAttrs =
    [ A.class "table"
    ]


toRowAttrs : Option -> List (H.Attribute Msg)
toRowAttrs opt =
    let
        myStyle =
            if opt.selected then
                "#FFCC99"

            else
                "white"
    in
    [ A.style "background" myStyle
    ]


checkboxColumn : Table.Column Option Msg
checkboxColumn =
    Table.veryCustomColumn
        { name = "Select"
        , viewData = viewCheckbox
        , sorter = Table.unsortable
        }


viewCheckbox : Option -> Table.HtmlDetails Msg
viewCheckbox { selected, ticker } =
    Table.HtmlDetails []
        [ H.input [ A.type_ "checkbox", A.checked selected, E.onClick (ToggleSelected ticker) ] []
        ]


buttonColumn : Table.Column Option Msg
buttonColumn =
    Table.veryCustomColumn
        { name = "Purchase"
        , viewData = tableButton
        , sorter = Table.unsortable
        }


tableButton : Option -> Table.HtmlDetails Msg
tableButton opt =
    Table.HtmlDetails []
        [ H.button [ A.class "btn btn-success", E.onClick (PurchaseMsgFor (PurchaseClick opt)) ] [ H.text "Buy" ]
        ]
