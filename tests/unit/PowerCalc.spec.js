import {shallowMount} from '@vue/test-utils'
import PowerCalc from '@/components/PowerCalc.vue'

describe('Pricing calculation for common resources.', () => {
    it('There are 3 common resources for 1$ and user wants to buy 1', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({currentPrice: 1, unitsLeftForThisPrice: 3, unitsToBuy: 1})
        expect(result).toEqual(1)
    })

    it('There are 3 common resources for 1$ and user wants to buy 2', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({currentPrice: 1, unitsLeftForThisPrice: 3, unitsToBuy: 2})
        expect(result).toEqual(2)
    })

    it('There are 3 common resources for 1$ and user wants to buy 3', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({currentPrice: 1, unitsLeftForThisPrice: 3, unitsToBuy: 3})
        expect(result).toEqual(3)
    })

    it('There are 3 common resources for 1$ and user wants to buy 4 (so the fourth is priced 2$)', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({currentPrice: 1, unitsLeftForThisPrice: 3, unitsToBuy: 4})
        expect(result).toEqual(5)
    })

    it('User wants to buy all resources available, that starts on 5$ with two units left.)', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({currentPrice: 5, unitsLeftForThisPrice: 2, unitsToBuy: 11})
        expect(result).toEqual(73)
    })
})

describe('Pricing calculation for uranium.', () => {
    it('All uranium is in the market and user wants to buy 1', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({
            currentPrice: 1,
            unitsLeftForThisPrice: 1,
            unitsToBuy: 1,
            resourceType: "uranium"
        })
        expect(result).toEqual(1)
    })

    it('All uranium is in the market and user wants to buy 2', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({
            currentPrice: 1,
            unitsLeftForThisPrice: 1,
            unitsToBuy: 2,
            resourceType: "uranium"
        })
        expect(result).toEqual(3)
    })

    it('Uranium is at 5$ and user wants to buy 4 units', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({
            currentPrice: 5,
            unitsLeftForThisPrice: 1,
            unitsToBuy: 4,
            resourceType: "uranium"
        })
        expect(result).toEqual(26)
    })

    it('Uranium is at 1 and user wants to buy it all', () => {
        const wrapper = shallowMount(PowerCalc)
        let result = wrapper.vm.calculateResourcePrice({
            currentPrice: 1,
            unitsLeftForThisPrice: 1,
            unitsToBuy: 12,
            resourceType: "uranium"
        })
        expect(result).toEqual(88)
    })
})