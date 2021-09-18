let proteins = [

	{
		name: "GFP",
		desc: "This protein glows in the dark",
		sequence: "MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK"
	},
	{
		name: "Ovalbumin",
		desc: "Egg white",
		sequence: "MGSIGAASMEFCFDVFKELKVHHANENIFYCPIAIMSALAMVYLGAKDSTRTQINKVVRFDKLPGFGDSIEAQCGTSVNVHSSLRDILNQITKPNDVYSFSLASRLYAEERYPILPEYLQCVKELYRGGLEPINFQTAADQARELINSWVESQTNGIIRNVLQPSSVDSQTAMVLVNAIVFKGLWEKAFKDEDTQAMPFRVTEQESKPVQMMYQIGLFRVASMASEKMKILELPFASGTMSMLVLLPDEVSGLEQLESIINFEKLTEWTSSNVMEERKIKVYLPRMKMEEKYNLTSVLMAMGITDVFSSSANLSGISSAESLKISQAVHAAHAEINEAGREVVGSAEAGVDAASVSEEFRADHPFLFCIKHIATNAVLFFGRCVSP"
	},

]


export class Proteins {

	static getProteins(){
		return proteins;
	}

	static lookUp(protname){

		if (protname.replace(/ /g,"") == "") return proteins;
		if (protname == "") return proteins;

		let prots = [];
		for(let i = 0; i < proteins.length; i++){
			let is_in_name = proteins[i].name.toLowerCase().includes(protname.toLowerCase()); 
			let is_in_desc = proteins[i].desc.toLowerCase().includes(protname.toLowerCase()); 
			if(is_in_name || is_in_desc){
				prots.push(proteins[i]);
			}

		}
		return prots;
	}

}