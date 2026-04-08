import { Component, computed, input, model } from '@angular/core';

@Component({
    selector: 'multi-tags-selector',
    templateUrl: './multi-tags-selector.html',
    styleUrl: './multi-tags-selector.less',
    imports: []
})
export class MultiTagsSelector
{
    public readonly value = model<string[]>();
    public readonly allowedTags = input<string[]>([]);
    public readonly allowCustomTags = input<boolean>(false);
    protected readonly availabeTags = computed(() => {
        if (!this.allowCustomTags())
            return this.allowedTags();

        return [...this.allowedTags(), ...(this.value() ?? [])];
    });

    protected tagClick(tag: string)
    {
        let tags = this.value() ?? [];
        let index = tags.indexOf(tag);

        if (index == -1)
            this.value.set([tag, ...tags]);
        else
            this.value.set(tags.filter(x => x != tag));
    }

    protected addTag(newTag: string)
    {
        if (!newTag || newTag.trim() == '')
            return;

        let tags = this.value() ?? [];
        let index = tags.indexOf(newTag ?? '');

        if (index == -1)
            this.value.set([newTag ?? '', ...tags]);
    }
}
