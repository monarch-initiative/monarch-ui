import {expect} from "chai";
import * as biolinkService from "@/api/BioLink";

describe("getSources", () => {
    it("returns MGI data", async() => {
        const sourcesData = await biolinkService.getSources();
        expect(sourcesData).to.not.be.empty;
        expect(sourcesData).to.be.a("array");
        expect(sourcesData[0]).to.be.a("object");
        expect(sourcesData[0].sourceDisplayName).to.be.a("string");
    });
});

