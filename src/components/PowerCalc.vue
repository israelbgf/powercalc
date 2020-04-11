<template>
    <div>
        <section>
            <h1>Seu Dinheiro</h1>
            <div>
                <input v-model="powerPlantPrice" type="text" placeholder="20+12" inputmode="numeric">
            </div>
        </section>

        <section>
            <h1>Leilão</h1>
            <div>
                <input v-model="powerPlantPrice" type="text" placeholder="20+12" inputmode="numeric">
            </div>
        </section>

        <section>
            <h1>Recursos</h1>
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
                        <td><input v-model="coalCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model="coalCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model="coalDesiredUnits" type="number" max="3" min="1"></td>
                        <td><span class="totalizador">10</span></td>
                    </tr>
                    <tr>
                        <td>Óleo</td>
                        <td><input v-model="oilCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model="oilCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model="oilDesiredUnits" type="number" max="3" min="1"></td>
                        <td><span class="totalizador">10</span></td>
                    </tr>
                    <tr>
                        <td>Lixo</td>
                        <td><input v-model="trashCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model="trashCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model="trashDesiredUnits" type="number" max="3" min="1"></td>
                        <td><span class="totalizador">10</span></td>
                    </tr>
                    <tr>
                        <td>Urânio</td>
                        <td><input v-model="uraniumCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model="uraniumCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model="uraniumDesiredUnits" type="number" max="3" min="1"></td>
                        <td><span class="totalizador">10</span></td>
                    </tr>
                </table>
            </div>
        </section>

        <section>
            <h1>Rede Elétrica</h1>
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
        computed: {
            city1Price() {
                if(this.city1PriceInput === "")
                    return 0
                try {
                    let price = this.city1PriceInput.toString()
                    if(price.charAt(price.length - 1) === '+')
                        price = price.slice(0, price.length - 1)

                    return eval(price)
                } catch (e) {
                    return 0
                }
            }
        },
        data() {
            return {
                powerPlantPrice: 0,

                coalCurrentMarketPrice: 0,
                coalCurrentMarketQuantity: 0,
                coalDesiredUnits: 0,
                oilCurrentMarketPrice: 0,
                oilCurrentMarketQuantity: 0,
                oilDesiredUnits: 0,
                trashCurrentMarketPrice: 0,
                trashCurrentMarketQuantity: 0,
                trashDesiredUnits: 0,
                uraniumCurrentMarketPrice: 0,
                uraniumCurrentMarketQuantity: 0,
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
