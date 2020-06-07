<template>
    <div>
        <div><a @click="changeLocale('en')" href="#">English</a> / <a @click="changeLocale('pt_BR')" href="#">Português</a></div>
        <section>
            <h1>{{ $t('current_money') }}</h1>
            <div style="margin-top: -20px; margin-bottom: 20px; font-size: 12px">({{$t('current_money_per_round')}}: {{initialMoneyPerRoundHistory.join(', ')}})</div>
            <div>
                <input v-model.number="currentMoney" type="text" placeholder="20+12" inputmode="numeric">
            </div>
        </section>

        <section>
            <h1>{{$t('auction')}}: <span>{{currentMoney}}</span> =>
                <span v-bind:class="{ green: balanceAfterBuyingPowerplant >= 0, red: balanceAfterBuyingPowerplant < 0 }">
                    {{balanceAfterBuyingPowerplant}}
                </span>
            </h1>
            <div>
                <input v-model.number="powerPlantPrice" type="text" placeholder="20+12" inputmode="numeric">
            </div>
        </section>

        <section>
            <h1>{{$t('resources')}}: <span>{{balanceAfterBuyingPowerplant}}</span> =>
                <span v-bind:class="{ green: balanceAfterBuyingResources >= 0, red: balanceAfterBuyingResources < 0 }">
                    {{balanceAfterBuyingResources}}
                </span>
            </h1>
            <div v-if="resourceBuyStepStyle === 'simplified'" >
                <table class="resources-table" align="center">
                    <thead>
                        <td>{{$t('coal')}}</td>
                        <td>{{$t('oil')}}</td>
                        <td>{{$t('garbage')}}</td>
                        <td>{{$t('uranium')}}</td>
                    </thead>
                    <tr>
                        <td><input v-model.number="coalExpectedPrice" type="number" max="99" min="0"></td>
                        <td><input v-model.number="oilExpectedPrice" type="number" max="99" min="0"></td>
                        <td><input v-model.number="trashExpectedPrice" type="number" max="99" min="0"></td>
                        <td><input v-model.number="uraniumExpectedPrice" type="number" max="99" min="0"></td>
                    </tr>
                </table>
            </div>
            <div v-if="resourceBuyStepStyle === 'advanced'" style="display: inline-flex">
                <table class="resources-table" align="center">
                    <thead>
                        <td></td>
                        <td>{{$t('price')}}</td>
                        <td>{{$t('left')}}</td>
                        <td>{{$t('want')}}</td>
                        <td></td>
                    </thead>
                    <tr>
                        <td>{{$t('coal')}}</td>
                        <td><input v-model.number="coalCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="coalCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="coalDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">{{costOfCoal}}</span></td>
                    </tr>
                    <tr>
                        <td>{{$t('oil')}}</td>
                        <td><input v-model.number="oilCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="oilCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="oilDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">{{costOfOil}}</span></td>
                    </tr>
                    <tr>
                        <td>{{$t('garbage')}}</td>
                        <td><input v-model.number="trashCurrentMarketPrice" type="number" max="8" min="1"></td>
                        <td><input v-model.number="trashCurrentMarketQuantity" type="number" max="3" min="1"></td>
                        <td><input v-model.number="trashDesiredUnits" type="number" max="24" min="1"></td>
                        <td><span class="totalizador">{{costOfTrash}}</span></td>
                    </tr>
                    <tr>
                        <td>{{$t('uranium')}}</td>
                        <td><input v-model.number="uraniumCurrentMarketPrice" type="number" max="16" min="1"></td>
                        <td><input v-model.number="uraniumCurrentMarketQuantity" type="number" max="1" min="1" disabled>
                        </td>
                        <td><input v-model.number="uraniumDesiredUnits" type="number" max="12" min="1"></td>
                        <td><span class="totalizador">{{costOfUranium}}</span></td>
                    </tr>
                </table>
            </div>
            <div>
                <button @click="changeResourceBuyStepStyle" style="margin-top: 20px">{{changeResourceBuyStepStyleLabel}}</button>
            </div>
        </section>

        <section>
            <h1>{{$t('power_grid')}}: <span>{{balanceAfterBuyingResources}}</span> =>
                <span v-bind:class="{ green: balanceAfterExpandingPowerGrid >= 0, red: balanceAfterExpandingPowerGrid < 0 }">
                    {{balanceAfterExpandingPowerGrid}}
                </span>
            </h1>

            <div class="city-input">{{$t('city')}} #1 <input v-model="city1PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city1Price }}</span></div>
            <div class="city-input">{{$t('city')}} #2 <input v-model="city2PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city2Price }}</span></div>
            <div class="city-input">{{$t('city')}} #3 <input v-model="city3PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city3Price }}</span></div>
            <div class="city-input">{{$t('city')}} #4 <input v-model="city4PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city4Price }}</span></div>
            <div class="city-input">{{$t('city')}} #5 <input v-model="city5PriceInput" type="text" placeholder="20+12" inputmode="numeric"> <span
                    class="totalizador">{{ city5Price }}</span></div>
        </section>

        <section>
            <h1>{{$t('bureaucracy.title')}}</h1>
            <p>{{$t('bureaucracy.i_fed')}} <input v-model="suppliedCities" type="number" max="20" min="0" inputmode="numeric" style="width: 30px"> {{$t('bureaucracy.winning')}} <b style="color: green">+${{moneyForSupplyingCities}}</b>.</p>
            <p>{{$t('bureaucracy.next_round')}} <b>${{expectedStartingMoneyForTheNextRound}}</b>.</p>
            <p>{{$t('bureaucracy.override')}} <input v-model="nextRoundMoneyOverride" style="width: 30px">.</p>
            <button v-on:click="newRound">{{$t('button.next_round')}}</button>
        </section>

    </div>
</template>

<script>
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });

    let initialValue = {
        currentMoney: 50,
        powerPlantPrice: 0,

        resourceBuyStepStyle: "simplified",

        coalExpectedPrice: 0,
        oilExpectedPrice: 0,
        trashExpectedPrice: 0,
        uraniumExpectedPrice: 0,

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

        suppliedCities: null,
        nextRoundMoneyOverride: null,
    }

    export default {
        name: 'PowerCalc',
        methods: {
            changeResourceBuyStepStyle(){
                this.resourceBuyStepStyle = this.resourceBuyStepStyle === 'simplified' ? 'advanced' : 'simplified'
            },

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

                    let specialSymbolsAreTreadedAsPlusSign = price
                        .replace(',', '+')
                        .replace('.', '+')
                        .replace('-', '+')
                        .replace(' ', '+');

                    return eval(specialSymbolsAreTreadedAsPlusSign)
                } catch (e) {
                    return 0
                }
            },
            newRound() {
                let nextRoundInitialValues = {...initialValue, 'currentMoney': this.nextRoundMoneyOverride || this.expectedStartingMoneyForTheNextRound}
                delete nextRoundInitialValues.resourceBuyStepStyle

                Object.entries(nextRoundInitialValues).forEach(([key, value]) => {
                    this[key] = value
                });

                this.initialMoneyPerRoundHistory.push(this.currentMoney)
                window.scrollTo(0, 0);
            },

            changeLocale(locale){
                this.$i18n.locale = locale
            }
        },
        computed: {
            changeResourceBuyStepStyleLabel(){
                return this.resourceBuyStepStyle === 'simplified' ? this.$t('button.advanced') : this.$t('button.simplified')
            },

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
                if (this.resourceBuyStepStyle === 'simplified')
                    return this.coalExpectedPrice

                return this.calculateResourcePrice({
                    currentPrice: this.coalCurrentMarketPrice,
                    unitsLeftForThisPrice: this.coalCurrentMarketQuantity,
                    unitsToBuy: this.coalDesiredUnits
                })
            },

            costOfOil() {
                if (this.resourceBuyStepStyle === 'simplified')
                    return this.oilExpectedPrice

                return this.calculateResourcePrice({
                    currentPrice: this.oilCurrentMarketPrice,
                    unitsLeftForThisPrice: this.oilCurrentMarketQuantity,
                    unitsToBuy: this.oilDesiredUnits
                })
            },

            costOfTrash() {
                if (this.resourceBuyStepStyle === 'simplified')
                    return this.trashExpectedPrice

                return this.calculateResourcePrice({
                    currentPrice: this.trashCurrentMarketPrice,
                    unitsLeftForThisPrice: this.trashCurrentMarketQuantity,
                    unitsToBuy: this.trashDesiredUnits
                })
            },

            costOfUranium() {
                if (this.resourceBuyStepStyle === 'simplified')
                    return this.uraniumExpectedPrice

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

            moneyForSupplyingCities(){
                return {
                    0: 10, 1: 22, 2: 33, 3: 44, 4: 54, 5: 64, 6: 73, 7: 82, 8: 90, 9: 98, 10: 105,
                    11: 112, 12: 118, 13: 124, 14: 129, 15: 134, 16: 138, 17: 142, 18: 145, 19: 148, 20: 150
                }[this.suppliedCities || 0]
            },

            expectedStartingMoneyForTheNextRound(){
                return this.balanceAfterExpandingPowerGrid + this.moneyForSupplyingCities
            }

        },
        data() {
            return {...initialValue, 'initialMoneyPerRoundHistory': [50]}
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
        margin: 0 10px 0 10px;
        font-weight: bold;
    }

    .green {
        color: green;
    }

    .red {
        color: orangered;
    }

    .red::after{
        content: "!"
    }

    table {
        border: 1px solid black;
        border-collapse: collapse;
    }
    table tr {
        border: 1px solid black;
    }
    th,
    td {
        padding: 5px;
        border: 1px solid black;
    }

    .city-input {
        margin: 5px 0 5px 0;
    }

</style>
