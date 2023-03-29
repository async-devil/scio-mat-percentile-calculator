export class Random {
	/** @param intSeed 32bit seed number made of string seed by xmur3 */
	private intSeed: number;
	private strSeed: string;

	/** @param seed seed for PRNG, will be generated new if not passed */
	constructor(seed?: string) {
		this.strSeed = seed || (Math.random() + 1).toString(36).substring(2);
		this.intSeed = this.xmur3(this.strSeed);
	}

	/**
	 * xmur3 seed generate algorithm
	 * @returns 32bit seed
	 */
	private xmur3(str: string): number {
		let h = 1779033703 ^ str.length;

		for (let i = 0; i < str.length; i++) {
			h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
			h = (h << 13) | (h >>> 19);
		}

		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);

		return (h ^= h >>> 16) >>> 0;
	}

	/**
	 * mulberry32 PRNG algorithm
	 * @param seed 32bit seed
	 * @returns pseudo random float from 0 to 1
	 */
	private mulberry32(seed: number): number {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;

		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}

	public get seed(): string {
		return this.strSeed;
	}

	/**
	 * Get pseudo random float between 0 and 1
	 * @returns pseudo random float between 0 and 1
	 */
	public randomFloat(): number {
		const seed = this.intSeed++;

		return this.mulberry32(seed);
	}

	/**
	 * Get pseudo random integer between min and max inclusive
	 * @param min inclusive min number
	 * @param max inclusive max number
	 * @returns pseudo random integer between min and max inclusive
	 */
	randomIntArbitrary(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(this.randomFloat() * (max - min + 1)) + min;
	}

	/**
	 * Get pseudo random float normal distributed between min and max exclusive and skew if needed
	 * @param min exclusive min number @default 0
	 * @param max exclusive max number @default 1
	 * @param skew skew parameter @default 1
	 * @returns normal distributed pseudo random number
	 */
	public randomGaussianArbitrarySkew(min = 0, max = 1, skew = 1): number {
		const u = this.randomFloat();
		const v = this.randomFloat();

		let num = Math.sqrt(-2.0 * Math.log(u || u + 0.2)) * Math.cos(2.0 * Math.PI * (v || v + 0.2));

		num = num / 10.0 + 0.5; // Translate to 0 -> 1

		if (num > 1 || num < 0) num = this.randomGaussianArbitrarySkew(min, max, skew);
		// resample between 0 and 1 if out of range
		else {
			num = Math.pow(num, skew); // Skew
			num *= max - min; // Stretch to fill range
			num += min; // offset to min
		}
		return num;
	}

	/**
	 * Get pseudo random float normal distributed between min and max inclusive
	 * @param min inclusive min number @default 0
	 * @param max inclusive max number @default 1
	 * @param mean mean value @default 0.5 // mean value between min and max
	 * @returns normal distributed pseudo random number
	 */
	public randomGaussianArbitraryMean(min = 0, max = 1, mean = (max - min) / 2) {
		const stdDev = (max - min) / 6; // using the empirical rule for normal distributions

		// using the Box-Muller transform to generate random values from a normal distribution
		const u = 1 - this.randomFloat();
		const v = 1 - this.randomFloat();
		const randStdNormal = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

		return mean + stdDev * randStdNormal;
	}
}
