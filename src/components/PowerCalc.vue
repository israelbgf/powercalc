<template>
    <div>
        <section>
            <h1>Seu Dinheiro</h1>
            <div>
                <input v-model.number="currentMoney" type="text" placeholder="20+12" inputmode="numeric">
            </div>
        </section>

        <section>
            <h1>Leilão (<span>{{currentMoney}}</span> => <span>{{balanceAfterBuyingPowerplant}}</span>)</h1>
            <div>
                <input v-model.number="powerPlantPrice" type="text" placeholder="20+12" inputmode="numeric">
            </div>
        </section>

        <section>
            <h1>Recursos (<span>{{balanceAfterBuyingPowerplant}}</span> =>
                <span>{{balanceAfterBuyingResources}}</span>)</h1>
            <div>
                <table align="center">
                    <thead>
                    <td></td>
                    <td>Preço</td>
                    <td>Restante</td>
                    <td>Desejado</td>
                    <td>Total</td>
                    </thead>
                    <tr>
                        <td>Carvão</td>
                        <td><input v-model.number="coalCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="coalCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="coalDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">{{costOfCoal}}</span></td>
                    </tr>
                    <tr>
                        <td>Óleo</td>
                        <td><input v-model.number="oilCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="oilCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="oilDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">{{costOfOil}}</span></td>
                    </tr>
                    <tr>
                        <td>Lixo</td>
                        <td><input v-model.number="trashCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="trashCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="trashDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">{{costOfTrash}}</span></td>
                    </tr>
                    <tr>
                        <td>Urânio</td>
                        <td><input v-model.number="uraniumCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="uraniumCurrentMarketQuantity" type="number" max="1" min="1" disabled>
                        </td>
                        <td><input v-model.number="uraniumDesiredUnits" type="number" max="12" min="1"></td>
                        <td><span class="totalizador">{{costOfUranium}}</span></td>
                    </tr>
                </table>
            </div>
        </section>

        <section>
            <h1>Rede Elétrica (<span>{{balanceAfterBuyingResources}}</span> =>
                <span>{{balanceAfterExpandingPowerGrid}}</span>)</h1>

            <div>Cidade #1 <input v-model="city1PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city1Price }}</span></div>
            <div>Cidade #2 <input v-model="city2PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city2Price }}</span></div>
            <div>Cidade #3 <input v-model="city3PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city3Price }}</span></div>
            <div>Cidade #4 <input v-model="city4PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city4Price }}</span></div>
            <div>Cidade #5 <input v-model="city5PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city5Price }}</span></div>
        </section>

    </div>
</template>

<script>
    export default {
        name: 'PowerCalc',
        methods: {
            calculateResourcePrice({currentPrice, unitsLeftForThisPrice, unitsToBuy, resourceType = "common"}) {
                if (currentPrice <= 0 || unitsLeftForThisPrice <= 0 || unitsToBuy <= 0) {
                    return 0
                }
                if (unitsToBuy <= unitsLeftForThisPrice) {
                    return unitsToBuy * currentPrice
                }

                let resourceMarket, startOfTheGroup, firstResource
                if (resourceType === "common") {
                    resourceMarket = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
                    startOfTheGroup = (currentPrice - 1) * 3
                    firstResource = startOfTheGroup + (3 - unitsLeftForThisPrice);
                } else {
                    resourceMarket = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16]
                    startOfTheGroup = currentPrice <= 8 ? currentPrice - 1 : {
                        10: 8,
                        12: 9,
                        14: 10,
                        16: 11
                    }[currentPrice]
                    firstResource = startOfTheGroup;
                }
                return resourceMarket.slice(firstResource, firstResource + unitsToBuy).reduce((a, b) => a + b, 0)
            },
            calculateExpansionCost(input) {
                if (input === "")
                    return 0
                try {
                    let price = input.toString()
                    if (price.charAt(price.length - 1) === '+')
                        price = price.slice(0, price.length - 1)

                    return eval(price)
                } catch (e) {
                    return 0
                }
            }

        },
        computed: {
            balanceAfterBuyingPowerplant() {
                return this.currentMoney - this.powerPlantPrice
            },
            balanceAfterBuyingResources() {
                return this.balanceAfterBuyingPowerplant - (
                    this.costOfCoal + this.costOfOil + this.costOfTrash + this.costOfUranium
                )
            },
            balanceAfterExpandingPowerGrid() {
                return this.balanceAfterBuyingResources - (
                    this.city1Price + this.city2Price + this.city3Price + this.city4Price + this.city5Price
                )
            },

            costOfCoal() {
                return this.calculateResourcePrice({
                    currentPrice: this.coalCurrentMarketPrice,
                    unitsLeftForThisPrice: this.coalCurrentMarketQuantity,
                    unitsToBuy: this.coalDesiredUnits
                })
            },

            costOfOil() {
                return this.calculateResourcePrice({
                    currentPrice: this.oilCurrentMarketPrice,
                    unitsLeftForThisPrice: this.oilCurrentMarketQuantity,
                    unitsToBuy: this.oilDesiredUnits
                })
            },

            costOfTrash() {
                return this.calculateResourcePrice({
                    currentPrice: this.trashCurrentMarketPrice,
                    unitsLeftForThisPrice: this.trashCurrentMarketQuantity,
                    unitsToBuy: this.trashDesiredUnits
                })
            },

            costOfUranium() {
                return this.calculateResourcePrice({
                    currentPrice: this.uraniumCurrentMarketPrice,
                    unitsLeftForThisPrice: this.uraniumCurrentMarketQuantity,
                    unitsToBuy: this.uraniumDesiredUnits,
                    resourceType: "uranium"
                })
            },

            city1Price() {
                return this.calculateExpansionCost(this.city1PriceInput)
            },

            city2Price() {
                return this.calculateExpansionCost(this.city2PriceInput)
            },

            city3Price() {
                return this.calculateExpansionCost(this.city3PriceInput)
            },

            city4Price() {
                return this.calculateExpansionCost(this.city4PriceInput)
            },

            city5Price() {
                return this.calculateExpansionCost(this.city5PriceInput)
            },

        },
        data() {
            return {
                currentMoney: 50,
                powerPlantPrice: 1,

                coalCurrentMarketPrice: 1,
                coalCurrentMarketQuantity: 3,
                coalDesiredUnits: 0,
                oilCurrentMarketPrice: 1,
                oilCurrentMarketQuantity: 3,
                oilDesiredUnits: 0,
                trashCurrentMarketPrice: 1,
                trashCurrentMarketQuantity: 3,
                trashDesiredUnits: 0,
                uraniumCurrentMarketPrice: 1,
                uraniumCurrentMarketQuantity: 1,
                uraniumDesiredUnits: 0,

                city1PriceInput: "",
                city2PriceInput: "",
                city3PriceInput: "",
                city4PriceInput: "",
                city5PriceInput: "",
            }
        }
    }
</script>

<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .totalizador {
        font-weight: bold;
    }
</style>
