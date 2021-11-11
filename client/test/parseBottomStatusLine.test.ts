/* 
3.1 The status lines (bottom)
The bottom two lines of the screen contain several cryptic pieces of information describing your current status. If either status line becomes longer than the width of the screen, you might not see all of it. Here are explanations of what the various status items mean (though your configuration may not have all the status items listed below):

Rank
Your character's name and professional ranking (based on the experience level, see below).
Strength
A measure of your character's strength; one of your six basic attributes. A human character's attributes can range from 3 to 18 inclusive; non-humans may exceed these limits (occasionally you may get super-strengths of the form 18/xx, and magic can also cause attributes to exceed the normal limits). The higher your strength, the stronger you are. Strength affects how successfully you perform physical tasks, how much damage you do in combat, and how much loot you can carry.
Dexterity
Dexterity affects your chances to hit in combat, to avoid traps, and do other tasks requiring agility or manipulation of objects.
Constitution
Constitution affects your ability to recover from injuries and other strains on your stamina.
Intelligence
Intelligence affects your ability to cast spells and read spellbooks.
Wisdom
Wisdom comes from your practical experience (especially when dealing with magic). It affects your magical energy.
Charisma
Charisma affects how certain creatures react toward you. In particular, it can affect the prices shopkeepers offer you.
Alignment
Lawful, Neutral, or Chaotic. Often, Lawful is taken as good and Chaotic as evil, but legal and ethical do not always coincide. Your alignment influences how other monsters react toward you. Monsters of a like alignment are more likely to be non-aggressive, while those of an opposing alignment are more likely to be seriously offended at your presence.
Dungeon Level
How deep you are in the dungeon. You start at level one and the number increases as you go deeper into the dungeon. Some levels are special, and are identified by a name and not a number. The Amulet of Yendor is reputed to be somewhere beneath the twentieth level.
Gold
The number of gold pieces you are openly carrying. Gold which you have concealed in containers is not counted.
Hit Points
Your current and maximum hit points. Hit points indicate how much damage you can take before you die. The more you get hit in a fight, the lower they get. You can regain hit points by resting, or by using certain magical items or spells. The number in parentheses is the maximum number your hit points can reach.
Power
Spell points. This tells you how much mystic energy (mana) you have available for spell casting. Again, resting will regenerate the amount available.
Armor Class
A measure of how effectively your armor stops blows from unfriendly creatures. The lower this number is, the more effective the armor; it is quite possible to have negative armor class.
Experience
Your current experience level and experience points. As you adventure, you gain experience points. At certain experience point totals, you gain an experience level. The more experienced you are, the better you fight and withstand magical attacks. Many dungeons show only your experience level here.
Time
The number of turns elapsed so far, displayed if you have the time option set.
Hunger status
Your current hunger status, ranging from Satiated down to Fainting. If your hunger status is normal, it is not displayed.
Additional status flags may appear after the hunger status: Conf when you're confused, FoodPois or Ill when sick, Blind when you can't see, Stun when stunned, and Hallu when hallucinating.
*/

import { parseBottomStatusLine } from "../src/parsers/parseBottomStatusLine";

describe("parseBottomStatusLine", () => {
  it("should parse dungeon level", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.dungeonLevel).toBe(1);
  });
  it("should parse gold", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.gold).toBe(0);
  });
  it("should parse currentHitpoints", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.currentHitPoints).toBe(11);
  });
  it("should parse maxHitPoints", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.maxHitPoints).toBe(11);
  });
  it("should parse currentPower", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.currentPower).toBe(7);
  });
  it("should parse maxPower", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.maxPower).toBe(7);
  });
  it("should parse armorClass", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.armorClass).toBe(9);
  });
  it("should parse experienceLevel", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.experienceLevel).toBe(1);
  });
  it("should parse experiencePoints", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46    "
    );
    expect(result?.experiencePoints).toBe(0);
  });
  it("should parse time", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.time).toBe(46);
  });
  it("should parse status", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46 Something   "
    );
    expect(result?.status).toBe("Something");
  });
  it("should parse empty status", () => {
    const result = parseBottomStatusLine(
      "Dlvl:1  $:0  HP:11(11) Pw:7(7) AC:9  Xp:1/0 T:46   "
    );
    expect(result?.status).toBe("");
  });
});
