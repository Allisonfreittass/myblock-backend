const axios = require('axios')

/**
 * @param {string} cep
 * @param {string} address
 * @param {string} city
 * @param {string} state
 * @returns {Promise<[number, number] | null>}
 */

async function getCoordenates(cep, address, city, state) {
    const query = `${address}, ${city}, ${state},${cep}`
    const url = `https://nominatim.openstreetmap.org/search`;

    try {
        const response = await axios.get(url, {
            params: {
                q: query,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'MyBlock/1.0 (allisonfreittass@gmail.com)'
            },
            family: 4
        })

        if (response.data && response.data.length > 0) {
            const locationData = response.data[0];

            return [
                parseFloat(locationData.lon),
                parseFloat(locationData.lat)
            ];

        } else {
            console.warn(`Nenhuma coordenada encontrada para ${query}`)
            return null;
        }

    } catch (e) {
        console.error("Não foi possivel consultar localização", e)
        return null
    }
}

module.exports = { getCoordenates }