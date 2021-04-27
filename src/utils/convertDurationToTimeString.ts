export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / 3600) //3600 = 60*60 Math.floor:arredonda o valor para baixo
    const minutes = Math.floor((duration % 3600) / 60) // o resto da divisão de duration e dividir por 60
    const seconds = duration % 60; // o  resto da divisão de duration por 60

    const timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0')) // padStart é uma função que manterá sempre horas, minutos e seg em 2 dígitos e qdo for apenas 1 dígito acrescenta 0 antes do número
        .join(':') // para unir hours, minutes e seconds 00:00:00

        return timeString;
    }