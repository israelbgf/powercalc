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
            <h1>Recursos (<span>{{balanceAfterBuyingResources}}</span> =>
                <span>{{currentMoney - powerPlantPrice}}</span>)</h1>
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
                        <td><span class="totalizador">10</span></td>
                    </tr>
                    <tr>
                        <td>Lixo</td>
                        <td><input v-model.number="trashCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="trashCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="trashDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">10</span></td>
                    </tr>
                    <tr>
                        <td>Urânio</td>
                        <td><input v-model.number="uraniumCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="uraniumCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="uraniumDesiredUnits" type="number" max="12" min="1"></td>
                        <td><span class="totalizador">10</span></td>
                    </tr>
                </table>
            </div>
        </section>

        <section>
            <h1>Rede Elétrica {{balanceAfterExpandingPowerGrid}}</h1>
            <div>Cidade #1 <input v-model="city1PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city1Price }}</span></div>
            <div>Cidade #2 <input type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">32</span></div>
            <div>Cidade #3 <input type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">32</span></div>
            <div>Cidade #4 <input type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">32</span></div>
            <div>Cidade #5 <input type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">32</span></div>
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
            }
        },
        computed: {
            balanceAfterBuyingPowerplant() {
                return this.currentMoney - this.powerPlantPrice
            },
            balanceAfterBuyingResources() {
                return 0
                // return this.costOfCoal
                //     + this.calculateResourcePrice(
                //     this.oilCurrentMarketPrice, this.oilCurrentMarketQuantity, this.oilDesiredUnits
                // ) + this.calculateResourcePrice(
                //     this.trashCurrentMarketPrice, this.trashCurrentMarketQuantity, this.trashDesiredUnits
                // ) + this.calculateResourcePrice(
                //     this.uraniumCurrentMarketPrice, this.uraniumCurrentMarketQuantity, this.uraniumDesiredUnits,
                //     "uranium"
                // )
            },
            balanceAfterExpandingPowerGrid() {
                return 0
            },

            costOfCoal() {
                return this.calculateResourcePrice({
                    currentPrice: this.coalCurrentMarketPrice,
                    unitsLeftForThisPrice: this.coalCurrentMarketQuantity,
                    unitsToBuy: this.coalDesiredUnits
                })
            },

            city1Price() {
                if (this.city1PriceInput === "")
                    return 0
                try {
                    let price = this.city1PriceInput.toString()
                    if (price.charAt(price.length - 1) === '+')
                        price = price.slice(0, price.length - 1)

                    return eval(price)
                } catch (e) {
                    return 0
                }
            }
        },
        data() {
            return {
                currentMoney: 0,
                powerPlantPrice: 0,

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
                uraniumCurrentMarketQuantity: 3,
                uraniumDesiredUnits: 0,

                city1PriceInput: 0,
                city2PriceInput: 0,
                city3PriceInput: 0,
                city4PriceInput: 0,
                city5PriceInput: 0,
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
